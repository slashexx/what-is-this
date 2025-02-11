'use client';

import React, { useState } from "react";
import { UsersTable } from "./(componentsTwo)/users-table";
import { SearchInput } from "./(componentsTwo)/search-input";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState(""); // Manage search term here

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Users</h1>
        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <UsersTable searchTerm={searchTerm} /> 
    </div>
  );
}
