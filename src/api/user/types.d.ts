declare global {
  declare type UserRequestParams = {
    username: string;
    password: string;
  };

  declare type UserRes = {
    code: number,
    data: Record<string,string>
  }
}

export {}