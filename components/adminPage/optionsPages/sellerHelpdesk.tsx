"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "../optionsPages/dataTableHelpDesk";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllQueryFromFireStore } from "@/lib/firebaseFunc";

export function SellerHelpdeskPage() {
  const [data, setData] = useState<any>([]);
  const [section, setSection] = useState<string>("active");
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const getQueries = async () => {
    console.log("getQueries called");
    try {
      const queries = await getAllQueryFromFireStore(section);
      setData(queries);
    } catch (error) {
      console.error("Error fetching queries:", error);
      setData([]);
    }
  };

  useEffect(() => {
    getQueries();
  }, [section, isChanged]);

  const onCLick = (e: any) => {
    if (section != e.value && e.value == "resolved") {
      setSection("resolved");
    } else if (section != e.value && e.value == "active") {
      setSection("active");
    } else if (section != e.value && e.value == "reopened") {
      setSection("reopened");
    } else if (section != e.value && e.value == "closed") {
      setSection("closed");
    }
  };

  return (
    <div className="min-h-[615px] w-full flex flex-col p-4 bg-white rounded-2xl">
      <h2 className="text-3xl w-full flex font-medium justify-center items-center mb-6">
        Help Desk
      </h2>
      <div className="flex gap-2 mb-5">
        <Button
          value="active"
          className={cn(
            "rounded-md text-white ",
            section === "active"
              ? "bg-[#695d56]"
              : "bg-white text-[#695d56]",
            "hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={(e) => onCLick(e.target)}
        >
          Active
        </Button>
        <Button
          value="resolved"
          className={cn(
            "rounded-md text-white ",
            section === "resolved"
              ? "bg-[#695d56]"
              : "bg-white text-[#695d56]",
            "hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={(e) => onCLick(e.target)}
        >
          Resolved
        </Button>
        <Button
          value="reopened"
          className={cn(
            "rounded-md text-white ",
            section === "reopened"
              ? "bg-[#695d56]"
              : "bg-white text-[#695d56]",
            "hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={(e) => onCLick(e.target)}
        >
          Re-opened
        </Button>
        <Button
          value="closed"
          className={cn(
            "rounded-md text-white ",
            section === "closed"
              ? "bg-[#695d56]"
              : "bg-white text-[#695d56]",
            "hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={(e) => onCLick(e.target)}
        >
          Closed
        </Button>
      </div>
      <DataTable
        getQueries={getQueries}
        finalData={data}
        option={"seller"}
        section={section}
        setSection={setSection}
        setIsChanged={setIsChanged}
      />
    </div>
  );
}
