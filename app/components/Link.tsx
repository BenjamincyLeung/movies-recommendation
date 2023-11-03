"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

interface Props {
  href: string;
  children: ReactNode;
}

const LinkToFilm = ({ href, children }: Props) => {
  return <Link href={href}>{children}</Link>;
};

export default LinkToFilm;
