"use server";

import { checkRole } from "../../../utils/roles";
import { clerkClient } from "@clerk/nextjs/server";

export async function setRole(formData: FormData): Promise<void> {
  const client = await clerkClient();

  // Check that the user trying to set the role is an admin
  if (!checkRole("admin")) {
    throw new Error("Not Authorized");
  }

  try {
    const res = await client.users.updateUser(formData.get("id") as string, {
      publicMetadata: { role: formData.get("role") },
    });
    console.log({ message: res.publicMetadata });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }
}

export async function removeRole(formData: FormData): Promise<void> {
  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(formData.get("id") as string, {
      publicMetadata: { role: null },
    });
    console.log({ message: res.publicMetadata });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }
}
