import React, { useState } from "react";
import Image from "next/image";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  useModal,
} from "@/components/ui/shadcn-io/animated-modal";
import toast, { Toaster } from "react-hot-toast";
import { waitlistEmailSchema } from "@/lib/validators/waitlist";

interface ButtonProps {
  email: string;
}

function ButtonContent({ email }: ButtonProps) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const waitlistLink = "https://vici-app.vercel.app/";
  const { setOpen } = useModal();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(waitlistLink);
  };
  
  const handleJoinWaitlist = async () => {
    const parsedinput = waitlistEmailSchema.safeParse({ email });
    if (!parsedinput.success) {
      const errorMsg = parsedinput.error.issues.map(issue => issue.message).join("; ") || "Please enter your email in correct format";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        
      });
       
      const data = await response.json();

      if (response.status === 409) {
        // User already exists, open modal
        toast.success("Thanks for joining our waitlist.");
        setOpen(true);
      } else if (!response.ok) {
        setError(data.error || "Failed to join waitlist");
      } else {
        // Successfully created user, open modal
        toast.success("Thanks for joining our waitlist.");
        setOpen(true);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error joining waitlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!name && !city) {
      return; // Skip if no data to update
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, // Always include email for backend validation
          name: name || undefined,
          location: city || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update profile");
      } else {
        // Successfully updated
        setOpen(false);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex items-center justify-center">
        <button 
        className="bg-black dark:bg-white text-md dark:text-black text-white rounded-full disabled:opacity-80 disabled:cursor-not-allowed"  
        style={{ padding: '0.75rem 2rem' }}
        onClick={handleJoinWaitlist}
        disabled={!email || isLoading}
      >
        {isLoading ? "Loading..." : "Join waitlist"}
      </button>
      <ModalBody>
        <ModalContent>
          <div className="flex flex-col items-center justify-center w-full">
            <h4 className="text-2xl md:text-4xl text-black font-black text-center" style={{ marginBottom: '8px' }}>
              daur.
            </h4>
            
            <p className="text-sm text-neutral-600 text-center" style={{ marginBottom: '32px' }}>
              Just one more step
            </p>

            {error && (
              <p className="text-sm text-red-600 text-center mb-4">
                {error}
              </p>
            )}
            
            {/* Input Fields */}
            <div className="w-full flex flex-col items-center" style={{ marginBottom: '32px' }}>
              <div style={{ marginBottom: '20px', width: '100%', maxWidth: '300px' }}>
                <label className="block text-sm font-medium text-black dark:text-neutral-300 text-center" style={{ marginBottom: '8px' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-center"
                  style={{ padding: '12px' }}
                  placeholder="Enter your name"
                />
              </div>
              <div style={{ width: '100%', maxWidth: '300px' }}>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 text-center" style={{ marginBottom: '8px' }}>
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-center"
                  style={{ padding: '12px' }}
                  placeholder="Enter your city"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleUpdateUser}
              disabled={isLoading || (!name && !city)}
              className="w-full max-w-[300px] bg-black text-white dark:bg-white dark:text-black rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              style={{ padding: '12px 16px' }}
            >
              {isLoading ? "Updating..." : "Submit"}
            </button>

            {/* Tell Your Friends */}
            <div className="w-full flex flex-col items-center" style={{ marginBottom: '24px' }}>
              <h5 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 text-center" style={{ marginBottom: '16px' }}>
                Tell your friends
              </h5>
              <div className="flex justify-center w-full" style={{ gap: '12px', maxWidth: '300px' }}>
                <a
                  href={waitlistLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-black text-white dark:bg-white dark:text-black rounded-lg text-center font-medium hover:opacity-90 transition"
                  style={{ padding: '12px 16px' }}
                >
                  Link
                </a>
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-black text-white dark:bg-white dark:text-black rounded-lg font-medium hover:opacity-90 transition"
                  style={{ padding: '12px 16px' }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </ModalContent>
      </ModalBody>
    </div>
    </>
  );
}

export default function Button({ email }: ButtonProps) {
  return (
    <Modal>
      <ButtonContent email={email} />
    </Modal>
  );
}