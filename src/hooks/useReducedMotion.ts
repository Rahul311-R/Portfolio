import { useTheme } from '../context/ThemeContext';

export const useReducedMotion = (): boolean => {
  const { reducedMotion } = useTheme();
  return reducedMotion;
};
