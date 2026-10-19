import type { SearchFieldProps } from '@valencesoftwareio/types';
import { TextField } from 'TextField';

export const SearchField = ({
  value,
  placeholder,
  onChangeText,
  onSubmit,
  disabled,
  label,
}: SearchFieldProps) => {
  return (
    <TextField
      variant="search"
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
      onSubmit={onSubmit}
      inputMode="search"
      disabled={disabled}
      label={label}
    />
  );
};
