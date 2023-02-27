/**
 * @file hooks / use-status.ts
 */

import { useState } from "react";

export enum StatusEnum {
  Idle,
  Loading,
  Error
};

export type StatusHook = {
  status: StatusEnum;
  message: string;
  setIdle: (message: string) => void;
  setLoading: (message: string) => void;
  setError: (message: string) => void;
};

export const useStatus = (): StatusHook => {
  const [status, setStatus] = useState<StatusEnum>(StatusEnum.Idle);
  const [message, setMessage] = useState<string>("");

  const set = (newStatus: StatusEnum, newMessage: string = "") => {
    setStatus(newStatus);
    setMessage(newMessage);
  };

  const setIdle = (message: string = "") => set(StatusEnum.Idle, message);
  const setLoading = (message: string = "") => set(StatusEnum.Loading, message);
  const setError = (message: string = "") => set(StatusEnum.Error, message);

  return {
    status,
    message,
    setIdle,
    setLoading,
    setError
  };
};
