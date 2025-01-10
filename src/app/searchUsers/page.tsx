import { redirect } from "next/navigation";
import { checkRole } from "../../../utils/roles";
import { SearchUsers } from "./SearchUsers";
import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "./_actions";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard(params: {
  searchParams: Promise<{ search?: string }>;
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = (await params.searchParams).search;

  const client = await clerkClient();

  const users = query ? (await client.users.getUserList({ query })).data : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <SearchUsers />
        {users.map((user) => {
          return (
            <div key={user.id} className="flex flex-col min-h-screen">
              <div className="p-4 bg-white shadow-md rounded-md space-y-4">
                <div className="text-lg font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </div>

                <div className="text-sm text-gray-600">
                  {
                    user.emailAddresses.find(
                      (email) => email.id === user.primaryEmailAddressId
                    )?.emailAddress
                  }
                </div>

                <div className="text-sm font-medium text-blue-600">
                  Role: {user.publicMetadata.role as string}
                </div>
                <div className="flex space-x-4 mt-2">
                  <form action={setRole} className="mt-2">
                    <input type="hidden" value={user.id} name="id" />
                    <input type="hidden" value="admin" name="role" />
                    <Button type="submit">Make Admin</Button>
                  </form>

                  <form action={setRole} className="mt-2">
                    <input type="hidden" value={user.id} name="id" />
                    <input type="hidden" value="moderator" name="role" />
                    <Button type="submit">Make Moderator</Button>
                  </form>

                  <form action={setRole} className="mt-2">
                    <input type="hidden" value={user.id} name="id" />
                    <input type="hidden" value="viewer" name="role" />
                    <Button type="submit">Make Viewer</Button>
                  </form>

                  <form action={removeRole} className="mt-2">
                    <input type="hidden" value={user.id} name="id" />
                    <Button
                      type="submit"
                      className=" px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition">
                      Remove Role
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
