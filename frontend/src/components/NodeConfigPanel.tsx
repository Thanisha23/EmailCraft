import React, { useEffect, useRef, useState } from "react";
import { Node } from "reactflow";
import { scheduleEmail } from "@/service/api";
import {
  ColdEmailNodeData,
  WaitDelayNodeData,
  LeadSourceNodeData,
  NodeData,
} from "@/types/flowchart";
import {
  X,
  Mail,
  Clock,
  Database,
  Send,
  Save,
  Upload,
  Link as LinkIcon,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface NodeConfigPanelProps {
  node: Node<NodeData>;
  onUpdate: (
    nodeId: string,
    data: Partial<ColdEmailNodeData | WaitDelayNodeData | LeadSourceNodeData>
  ) => void;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
}

export default function NodeConfigPanel({
  node,
  onUpdate,
  onClose,
  onDelete,
}: NodeConfigPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [emailInputRaw, setEmailInputRaw] = useState<string>("");
  const [localNodeData, setLocalNodeData] = useState<
    ColdEmailNodeData | WaitDelayNodeData | LeadSourceNodeData
  >(node.data as ColdEmailNodeData | WaitDelayNodeData | LeadSourceNodeData);

  useEffect(() => {
   
    switch (node.type) {
      case "coldEmail":
        setLocalNodeData(node.data as ColdEmailNodeData);
        break;
      case "delay":
        setLocalNodeData(node.data as WaitDelayNodeData);
        break;
      case "leadSource":
        setLocalNodeData(node.data as LeadSourceNodeData);
        break;
      default:
        console.error("Unknown node type:", node.type);
    }
  }, [node.data, node.type]);

  const toInputRef = useRef<HTMLInputElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const delayHoursRef = useRef<HTMLInputElement>(null);
  const emailListRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (node.type === "coldEmail" && toInputRef.current) {
      toInputRef.current.focus();
    } else if (node.type === "delay" && delayHoursRef.current) {
      delayHoursRef.current.focus();
    } else if (node.type === "leadSource" && emailListRef.current) {
      emailListRef.current.focus();
    }
  }, [node.type]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    e.stopPropagation();
    const { name, value } = e.target;

    if (node.type === "coldEmail") {
      setLocalNodeData((prev) => ({
        ...(prev as ColdEmailNodeData),
        [name]: value,
      }));
    } else if (node.type === "delay") {
      setLocalNodeData((prev) => ({
        ...(prev as WaitDelayNodeData),
        [name]: value,
      }));
    } else if (node.type === "leadSource") {
      setLocalNodeData((prev) => ({
        ...(prev as LeadSourceNodeData),
        [name]: value,
      }));
    }

    onUpdate(node.id, { [name]: value });
    setValidationErrors([]);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;

    setLocalNodeData(
      (prev: ColdEmailNodeData | WaitDelayNodeData | LeadSourceNodeData) => ({
        ...prev,
        [name]: numValue,
      })
    );

    onUpdate(node.id, { [name]: numValue });
  };

  const handleEmailListChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();

    const rawInput = e.target.value;
    setEmailInputRaw(rawInput);

    const emails = rawInput
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter((email) => !emailRegex.test(email));

    let errors: string[] = [];

    if (invalidEmails.length > 0) {
      errors = invalidEmails
        .slice(0, 3)
        .map((email) => `Invalid email format: ${email}`);
      if (invalidEmails.length > 3) {
        errors.push(`...and ${invalidEmails.length - 3} more invalid emails`);
      }
    }

    if (emails.length > 100) {
      errors.push("Maximum 100 email addresses allowed");
      emails.splice(100);
    }

    setValidationErrors(errors);

    setLocalNodeData(
      (prev: ColdEmailNodeData | WaitDelayNodeData | LeadSourceNodeData) => ({
        ...prev,
        emailList: emails.filter((email) => emailRegex.test(email)),
      })
    );

    onUpdate(node.id, {
      emailList: emails.filter((email) => emailRegex.test(email)),
    });
  };
  const handleScheduleEmail = async () => {
    if (node.type === "coldEmail") {
      const data = node.data as ColdEmailNodeData;

      if (data.to && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.to)) {
        toast.warning("Invalid email address format");
        return;
      }

      if (data.to && data.subject && data.body) {
        setIsSubmitting(true);
        try {
          const date = new Date();
          date.setHours(date.getHours() + 1);

          await scheduleEmail({
            to: data.to,
            subject: data.subject,
            body: data.body || "",
            date: date.toISOString(),
          });

          toast.success("Email scheduled successfully!");
        } catch (error) {
          console.error("Failed to schedule email:", error);
          toast.error("Failed to schedule email");
        } finally {
          setIsSubmitting(false);
        }
      } else {
        toast.warning("Please fill in all required fields");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.warning("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvContent = event.target?.result as string;
        const lines = csvContent.split("\n");
        const headers = lines[0].split(",");

        const emailColumnIndex = headers.findIndex(
          (header) =>
            header.toLowerCase().trim() === "email" ||
            header.toLowerCase().trim() === "email address" ||
            header.toLowerCase().trim() === "e-mail"
        );

        if (emailColumnIndex === -1) {
          toast.warning('CSV file must contain an &quot;email&quot; column');
          return;
        }

        const emails: string[] = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(",");
          if (row.length > emailColumnIndex) {
            const email = row[emailColumnIndex].trim();
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              emails.push(email);
            }
          }
        }

        if (emails.length === 0) {
          toast.warning("No valid email addresses found in the CSV file");
          return;
        }

        onUpdate(node.id, { emailList: emails });
        toast.success(`Successfully imported ${emails.length} email addresses`);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast.error("Failed to parse CSV file");
      }
    };

    reader.readAsText(file);
  };

  const getNodeIcon = () => {
    switch (node.type) {
      case "coldEmail":
        return <Mail className="h-5 w-5 text-indigo-500" />;
      case "delay":
        return <Clock className="h-5 w-5 text-indigo-500" />;
      case "leadSource":
        return <Database className="h-5 w-5 text-indigo-500" />;
      default:
        return null;
    }
  };

  const getNodeTitle = () => {
    switch (node.type) {
      case "coldEmail":
        return "Email Configuration";
      case "delay":
        return "Delay Settings";
      case "leadSource":
        return "Lead Source Settings";
      default:
        return "Configure Node";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-indigo-900/20 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white rounded-xl shadow-xl overflow-hidden border border-indigo-100 max-w-md w-full transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-indigo-100 flex justify-between items-center bg-indigo-50/80">
          <div className="flex items-center">
            {getNodeIcon()}
            <h2 className="text-xl font-semibold text-indigo-900 ml-2">
              {getNodeTitle()}
            </h2>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-indigo-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-4">
            {node.type === "coldEmail" && (
              <>
                <div>
                  <label
                    className="block text-indigo-900 text-sm font-medium mb-2"
                    htmlFor="to"
                  >
                    Test Recipient Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-indigo-400" />
                    </div>
                    <input
                      ref={toInputRef as React.RefObject<HTMLInputElement>}
                      type="email"
                      id="to"
                      name="to"
                      value={(localNodeData as ColdEmailNodeData).to || ""}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-indigo-50/30 text-indigo-900"
                      placeholder="For testing: recipient@example.com"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <p className="mt-1 text-xs text-indigo-400">
                    This email is only used for testing. Recipients will come
                    from Lead Source nodes.
                  </p>
                </div>

                <div>
                  <label
                    className="block text-indigo-900 text-sm font-medium mb-2"
                    htmlFor="subject"
                  >
                    Subject
                  </label>
                  <input
                    ref={subjectInputRef}
                    type="text"
                    id="subject"
                    name="subject"
                    value={(localNodeData as ColdEmailNodeData).subject || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-indigo-50/30 text-indigo-900"
                    placeholder="Email Subject"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div>
                  <label
                    className="block text-indigo-900 text-sm font-medium mb-2"
                    htmlFor="emailBody"
                  >
                    Email Body
                  </label>
                  <textarea
                    id="emailBody"
                    name="body"
                    value={(localNodeData as ColdEmailNodeData).body || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-indigo-50/30 h-32 text-indigo-900"
                    placeholder="Type your email message here..."
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <button
                  onClick={handleScheduleEmail}
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center px-4 py-3 mt-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Test: Schedule This Email
                    </>
                  )}
                </button>
              </>
            )}

            {node.type === "delay" && (
              <>
                <div>
                  <label
                    className="block text-indigo-900 text-sm font-medium mb-2"
                    htmlFor="delayHours"
                  >
                    Delay (Hours)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-indigo-400" />
                    </div>
                    <input
                      ref={delayHoursRef}
                      type="number"
                      id="delayHours"
                      name="delayHours"
                      value={
                        (localNodeData as WaitDelayNodeData).delayHours || 0
                      }
                      onChange={handleNumberChange}
                      className="w-full pl-10 pr-3 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-indigo-50/30 text-indigo-900"
                      min="0"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-indigo-900 text-sm font-medium mb-2"
                    htmlFor="delayMinutes"
                  >
                    Delay (Minutes)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-indigo-400" />
                    </div>
                    <input
                      type="number"
                      id="delayMinutes"
                      name="delayMinutes"
                      value={
                        (localNodeData as WaitDelayNodeData).delayMinutes || 0
                      }
                      onChange={handleNumberChange}
                      className="w-full pl-10 pr-3 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-indigo-50/30 text-indigo-900"
                      min="0"
                      max="59"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                {/* Visual representation of delay time */}
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                  <div className="text-sm text-indigo-700 font-medium mb-2">
                    Total Delay:
                    <span className="ml-2 bg-white px-2 py-1 rounded-full border border-indigo-200 text-indigo-800">
                      {(node.data as WaitDelayNodeData).delayHours}h{" "}
                      {(node.data as WaitDelayNodeData).delayMinutes}m
                    </span>
                  </div>

                  <div className="h-4 bg-indigo-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-300 to-purple-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (((node.data as WaitDelayNodeData).delayHours * 60 +
                            (node.data as WaitDelayNodeData).delayMinutes) /
                            (24 * 60)) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <div className="mt-1 flex justify-between text-xs text-indigo-500">
                    <span>0h</span>
                    <span>12h</span>
                    <span>24h</span>
                  </div>
                </div>
              </>
            )}

            {node.type === "leadSource" && (
              <>
                <div>
                  <label
                    className="block text-indigo-900 text-sm font-medium mb-2"
                    htmlFor="sourceType"
                  >
                    Source Type
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Database className="h-4 w-4 text-indigo-400" />
                    </div>
                    <select
                      id="sourceType"
                      name="source"
                      value={
                        (localNodeData as LeadSourceNodeData).source ||
                        "Manual Input"
                      }
                      onChange={handleChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full pl-10 pr-3 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-indigo-50/30 appearance-none text-indigo-900"
                    >
                      <option value="Manual Input">Manual Input</option>
                      <option value="CSV Import">CSV Import</option>
                      <option value="API Integration">API Integration</option>
                    </select>
                  </div>
                </div>

                {(localNodeData as LeadSourceNodeData).source ===
                  "Manual Input" && (
                  <div>
                    <label
                      className="block text-indigo-900 text-sm font-medium mb-2"
                      htmlFor="emailList"
                    >
                      Email Addresses{" "}
                      <span className="text-xs text-indigo-400">
                        (comma separated, max 100)
                      </span>
                    </label>
                    <textarea
                      ref={emailListRef}
                      id="emailList"
                      name="emailListRaw"
                      value={emailInputRaw}
                      onChange={handleEmailListChange}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-indigo-900 w-full px-3 py-3 border-2 ${
                        validationErrors.length > 0
                          ? "border-red-300"
                          : "border-indigo-200"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-indigo-50/30 h-32`}
                      placeholder="Enter email addresses separated by commas"
                    />

                    {validationErrors.length > 0 && (
                      <div className="mt-2 text-sm text-red-600">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span>Please fix the following issues:</span>
                        </div>
                        <ul className="list-disc ml-5 mt-1">
                          {validationErrors.slice(0, 3).map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                          {validationErrors.length > 3 && (
                            <li>
                              ...and {validationErrors.length - 3} more errors
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(
                      (localNodeData as LeadSourceNodeData).emailList
                    ) &&
                      (localNodeData as LeadSourceNodeData).emailList.length >
                        0 &&
                      validationErrors.length === 0 && (
                        <div className="mt-2 text-sm text-green-600 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span>
                            {
                              (localNodeData as LeadSourceNodeData).emailList
                                .length
                            }{" "}
                            valid email
                            {(localNodeData as LeadSourceNodeData).emailList
                              .length !== 1
                              ? "s"
                              : ""}{" "}
                            added
                          </span>
                        </div>
                      )}
                  </div>
                )}

                {(localNodeData as LeadSourceNodeData).source ===
                  "CSV Import" && (
                  <div>
                    <label className="block text-indigo-900 text-sm font-medium mb-2">
                      Upload CSV File
                    </label>
                    <div className="border-2 border-dashed border-indigo-200 rounded-lg p-4 text-center bg-indigo-50/30">
                      <p className="text-indigo-700 mb-2">
                        CSV must include an &quot;email&quot; column
                      </p>
                      <label
                        className="cursor-pointer bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose CSV File
                        <input
                          type="file"
                          accept=".csv"
                          className="hidden"
                          onChange={handleFileUpload}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </label>

                      {Array.isArray(
                        (localNodeData as LeadSourceNodeData).emailList
                      ) &&
                        (localNodeData as LeadSourceNodeData).emailList.length >
                          0 && (
                          <div className="mt-3 text-left bg-white p-2 rounded-lg border border-indigo-100">
                            <div className="text-sm font-medium text-indigo-900 mb-1 flex items-center">
                              <Database className="h-4 w-4 mr-1" />
                              Imported Emails:{" "}
                              {
                                (localNodeData as LeadSourceNodeData).emailList
                                  .length
                              }
                            </div>
                            <div className="max-h-16 overflow-y-auto text-xs text-indigo-700">
                              {(localNodeData as LeadSourceNodeData).emailList
                                .slice(0, 5)
                                .map((email: string, idx: number) => (
                                  <div key={idx} className="truncate">
                                    {email}
                                  </div>
                                ))}
                              {(localNodeData as LeadSourceNodeData).emailList
                                .length > 5 && (
                                <div className="text-indigo-400">
                                  ...and{" "}
                                  {(localNodeData as LeadSourceNodeData)
                                    .emailList.length - 5}{" "}
                                  more
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}
                {(localNodeData as LeadSourceNodeData).source ===
                  "API Integration" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-indigo-900 text-sm font-medium mb-2">
                        API Endpoint
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LinkIcon className="h-4 w-4 text-indigo-400" />
                        </div>
                        <input
                          type="url"
                          name="apiEndpoint"
                          value={
                            (localNodeData as LeadSourceNodeData).apiEndpoint ||
                            ""
                          }
                          onChange={handleChange}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="https://api.example.com/leads"
                          className="w-full pl-10 pr-3 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-indigo-50/30 text-indigo-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-indigo-900 text-sm font-medium mb-2">
                        API Key (optional)
                      </label>
                      <input
                        type="password"
                        name="apiKey"
                        value={
                          (localNodeData as LeadSourceNodeData).apiKey || ""
                        }
                        onChange={handleChange}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Enter API key"
                        className="w-full px-3 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-indigo-50/30 text-indigo-900"
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.warning("API connection feature coming soon");
                        }}
                        className="w-full flex justify-center items-center px-4 py-2 border border-indigo-300 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Test API Connection
                      </button>
                      <p className="text-xs text-indigo-500 mt-2 text-center">
                        Note: This feature requires backend implementation
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </button>
          </div>
          <div className="p-4 border-t border-indigo-100">
            <button
              onClick={() => onDelete(node.id)}
              className="w-full flex justify-center items-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Node
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
