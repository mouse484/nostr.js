import { ClientEventBase } from './events/mod.ts';

export const proxify = <T extends ClientEventBase>(
  map: Map<string, T>,
  arg: string
) => {
  return new Proxy<T>({} as T, {
    get(_, property) {
      return map.get(arg)?.[property as keyof T];
    },
  });
};
