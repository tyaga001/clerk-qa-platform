"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      <h4 className="text-xl font-bold my-6">Search for users</h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const queryTerm = formData.get("search") as string;
          router.push(pathname + "?search=" + queryTerm);
        }}
        className="mb-6">
        <div className="flex gap-2">
          {/* <label htmlFor="search">Search for users</label> */}
          <Input id="search" name="search" type="text" className="flex-grow" />
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};
