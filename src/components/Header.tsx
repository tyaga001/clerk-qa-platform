"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";

const Header = () => {
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            Q&A Platform
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/">
                  <Button variant="ghost">Home</Button>
                </Link>
              </li>
              <li>
                <Link href="/qa">
                  <Button variant="ghost">Q&A</Button>
                </Link>
              </li>

              {(user?.publicMetadata?.role === "admin" ||
                user?.publicMetadata?.role === "moderator") && (
                <li>
                  <Link href="/admin">
                    <Button variant="ghost">Admin</Button>
                  </Link>
                </li>
              )}

              <li>
                <UserButton showName />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
