export const forward = (error, message: string) => {
  const e = error as Error;
  if (e.message?.startsWith('lohub:')) throw e;
  else throw new Error(`lohub:${message}`);
};
