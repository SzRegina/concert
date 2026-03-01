import React, { ReactNode } from "react";
import { useConcerts } from "../hooks/useConcerts";

type Props = {
  children: (args: {
    concerts: any[];
    loading: boolean;
    error: string;
    reload: () => void;
  }) => ReactNode;
};

export function Concerts({ children }: Props) {
  const { concerts, loading, error, reload } = useConcerts();
  return <>{children({ concerts, loading, error, reload })}</>;
}
