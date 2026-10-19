import type { ReactNode } from 'react';

type Pressable = { onPress?: () => void };
type Disableable = { disabled?: boolean };
type Labeled = { label: string };

export type ButtonKind = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerConfirm' | 'pill';

export interface ButtonProps extends Pressable, Disableable {
  kind?: ButtonKind;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
}

export interface StepButtonProps extends Pressable, Disableable {
  label: string;
  tone: 'positive' | 'negative';
}

export interface ChipProps extends Pressable, Disableable {
  selected?: boolean;
  icon?: IconSlot;
  children: ReactNode;
}

export interface DeltaPillProps {
  value: number;
  unit?: string;
}

export interface DurationPillProps {
  seconds: number;
  status?: 'paused' | 'completed' | 'live';
}

export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger';
  children: ReactNode;
}

export interface LinkProps extends Pressable, Disableable {
  href: string;
  external?: boolean;
  children: ReactNode;
}

export interface IconButtonProps extends Pressable, Disableable {
  icon: IconSlot;
  label: string;
  tone?: 'default' | 'danger';
}

export interface TextFieldProps extends Disableable, Labeled {
  variant?: 'default' | 'search';
  value: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  inputMode?: 'text' | 'email' | 'numeric' | 'decimal' | 'tel' | 'url' | 'search' | 'none';
  autoComplete?:
    'off' | 'name' | 'email' | 'username' | 'current-password' | 'new-password' | 'tel' | 'url';
  secureTextEntry?: boolean;
  maxLength?: number;
  error?: boolean;
  helperText?: string;
}

export interface TextAreaProps extends Disableable, Labeled {
  value: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  maxLength?: number;
  rows?: number;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export interface SearchFieldProps extends Disableable, Labeled {
  value: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
}

export interface PickerOption {
  value: string;
  label: string;
}

export interface PickerProps extends Disableable, Labeled {
  options: PickerOption[];
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

export type DatePickerValue = `${number}-${number}-${number}`;

export interface DatePickerProps extends Disableable, Labeled {
  value: DatePickerValue | null;
  onChange?: (value: DatePickerValue | null) => void;
  min?: DatePickerValue;
  max?: DatePickerValue;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export interface NumberFieldProps extends Disableable, Labeled {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  error?: boolean;
}

export interface ToggleProps extends Disableable, Labeled {
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

export interface RadioProps extends Disableable, Labeled {
  checked: boolean;
  onChange?: () => void;
  name?: string;
}

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps extends Disableable, Labeled {
  options: RadioOption[];
  value: string;
  onChange?: (value: string) => void;
}

export interface CheckboxProps extends Disableable, Labeled {
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

export interface SegmentedOption {
  value: string;
  label: string;
  icon?: IconSlot;
}

export interface SegmentedControlProps extends Disableable, Labeled {
  options: SegmentedOption[];
  value: string;
  onChange?: (value: string) => void;
}

export interface CardProps extends Pressable {
  status?: 'resting' | 'editing' | 'success' | 'skipped' | 'error';
  title: string;
  children?: ReactNode;
  actionLabel?: string;
}

export interface SurfaceProps {
  children?: ReactNode;
}

export interface DividerProps {
  inset?: boolean;
}

export interface AccordionProps {
  title: string;
  expanded: boolean;
  onChange?: (expanded: boolean) => void;
  children?: ReactNode;
}

export interface BottomSheetProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
}

export interface DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  showCloseButton?: boolean;
  dismissOnOutsidePress?: boolean;
  children?: ReactNode;
  actions?: ReactNode;
}

export interface AlertDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
  loading?: boolean;
}

export interface AlertProps {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: ReactNode;
}

export interface ToastProps {
  open: boolean;
  message: string;
  tone?: 'info' | 'success' | 'warning' | 'danger';
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

export interface TabOption {
  value: string;
  label: string;
  disabled?: boolean;
  content: ReactNode;
}

export interface TabsProps extends Labeled {
  options: TabOption[];
  value: string;
  onChange?: (value: string) => void;
}

export interface MenuItem {
  value: string;
  label: string;
  icon?: IconSlot;
  disabled?: boolean;
  danger?: boolean;
}

export interface MenuProps extends Disableable, Labeled {
  items: MenuItem[];
  onAction?: (value: string) => void;
}

export interface PopoverProps extends Labeled {
  open: boolean;
  trigger: ReactNode;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export interface ListRowProps extends Pressable {
  icon?: IconSlot;
  title: string;
  subtitle?: string;
  trailingIcon?: IconSlot;
  archived?: boolean;
  grouped?: boolean;
}

export interface SliderProps extends Disableable, Labeled {
  value: number;
  max: number;
  min?: number;
  step?: number;
  onChange?: (value: number) => void;
}

export interface ProgressBarProps extends Labeled {
  value: number;
  max?: number;
}

export interface SpinnerProps {
  size?: number;
  color?: string;
}

export type IconSlot = string | number | ((color: string) => ReactNode);

export type TypographyVariant =
  | 'display'
  | 'title'
  | 'titleSm'
  | 'body'
  | 'bodyLg'
  | 'meta'
  | 'eyebrow'
  | 'numeral'
  | 'label'
  | 'badge'
  | 'controlLabel'
  | 'mono';

export const TYPOGRAPHY_VARIANTS: TypographyVariant[] = [
  'display',
  'title',
  'titleSm',
  'body',
  'bodyLg',
  'meta',
  'eyebrow',
  'numeral',
  'label',
  'badge',
  'controlLabel',
  'mono',
];

export interface TypographyProps {
  variant: TypographyVariant;
  children: ReactNode;
}
