"use client";

import React, { useState, useEffect, Suspense } from "react";
import SideBar from "@/components/Navbar";
import { useUser } from "@/lib/supabase/hooks";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/supabase/api";
import { useToast } from "@/components/Toast";

function SettingsContent() {
  const { user, loading: userLoading } = useUser();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [workPlace, setWorkPlace] = useState("");
  const [skills, setSkills] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        toast("Failed to load profile", "error");
        setLoading(false);
        return;
      }

      if (data) {
        setUsername(data.username || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
        setWorkPlace(data.work_place || "");
        setSkills(
          Array.isArray(data.skills) ? data.skills.join(", ") : ""
        );
        setAvatarUrl(data.avatar_url || "");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await updateProfile(user.id, {
        username,
        bio,
        location,
        work_place: workPlace,
        skills: skillsArray,
        avatar_url: avatarUrl,
      });

      toast("Profile updated successfully!", "success");
    } catch {
      toast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (userLoading || loading) {
    return (
      <SideBar>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-sm text-gray-500 dark:text-neutral-400">
            Loading...
          </div>
        </div>
      </SideBar>
    );
  }

  if (!user) {
    return (
      <SideBar>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-2">
              Sign in required
            </h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Please sign in to access your settings.
            </p>
          </div>
        </div>
      </SideBar>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent text-sm";

  return (
    <SideBar>
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Edit your profile information.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl p-5 space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
            >
              Bio
            </label>
            <textarea
              id="bio"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="City, Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Work Place */}
          <div>
            <label
              htmlFor="work_place"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
            >
              Work Place
            </label>
            <input
              id="work_place"
              type="text"
              placeholder="Company or organization"
              value={workPlace}
              onChange={(e) => setWorkPlace(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Skills */}
          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
            >
              Skills
            </label>
            <input
              id="skills"
              type="text"
              placeholder="React, TypeScript, Node.js"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
              Separate skills with commas.
            </p>
          </div>

          {/* Avatar URL */}
          <div>
            <label
              htmlFor="avatar_url"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
            >
              Avatar URL
            </label>
            <input
              id="avatar_url"
              type="text"
              placeholder="https://example.com/avatar.png"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-gray-900 dark:bg-neutral-100 text-white dark:text-black text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </SideBar>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
