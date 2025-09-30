'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconChevronDown } from '@tabler/icons-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Option = { label: string; value: string; name?: string };

interface CustomSelectProps {
  name: string;
  label?: string;
  value?: string; // controlled
  defaultValue?: string; // uncontrolled initial
  onChange?: (data: {
    name: string;
    value: string;
    optionName?: string;
  }) => void;
  className?: string;
  options?: Option[]; // may be undefined at runtime
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  /** ถ้ามี onClear -> จะแสดงปุ่ม X */
  onClear?: () => void;
  contentClassName?: string;
  closeOnSelect?: boolean;
  renderOption?: (opt: Option, active: boolean) => React.ReactNode;
  renderValue?: (opt?: Option) => React.ReactNode;
  id?: string;
  'aria-label'?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
}

const CustomSelect = ({
  name,
  label,
  value,
  defaultValue,
  onChange,
  className,
  options = [],
  placeholder = 'Please select an option',
  disabled = false,
  loading = false,
  onClear,
  contentClassName,
  closeOnSelect = true,
  renderOption,
  renderValue,
  id,
  'aria-label': ariaLabel,
  error,
  required,
  containerClassName,
}: CustomSelectProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? ''
  );
  const currentValue = isControlled ? value ?? '' : internalValue;

  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // ✅ Normalize options once to avoid .find/.map crashes if options is ever non-array
  const safeOptions: Option[] = useMemo(() => {
    return Array.isArray(options) ? options : [];
  }, [options]);

  useEffect(() => {
    if (!isControlled) setInternalValue(defaultValue ?? '');
  }, [defaultValue, isControlled]);

  const selected = useMemo(
    () => safeOptions.find((o) => o.value === currentValue),
    [safeOptions, currentValue]
  );

  const commitChange = (next?: string) => {
    const finalValue = next ?? '';
    if (!isControlled) setInternalValue(finalValue);
    const selectedOpt = safeOptions.find((o) => o.value === finalValue);
    onChange?.({ name, value: finalValue, optionName: selectedOpt?.name });
  };

  const handleSelect = (next?: string) => {
    commitChange(next);
    if (closeOnSelect) setOpen(false);
  };

  const handleClear = () => {
    if (!currentValue) return;
    commitChange('');
    setOpen(false);
    onClear?.();
    buttonRef.current?.focus();
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      setOpen((v) => !v);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  const triggerText = selected?.label ?? (loading ? 'กำลังโหลด…' : placeholder);

  // Dev-only guard to surface bad props early
  if (process.env.NODE_ENV !== 'production' && !Array.isArray(options)) {
    // eslint-disable-next-line no-console
    console.warn(
      `[CustomSelect] "options" must be an array, received:`,
      options
    );
  }

  return (
    <div className={cn('relative w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'absolute top-[-11px] left-4 px-1 text-sm text-black bg-white! border-black z-10 rounded-sm tracking-wide',
            disabled && 'text-gray-500'
          )}
        >
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}

      <input type='hidden' name={name} value={currentValue} />

      <div
        className={cn(
          'relative w-full overflow-hidden',
          disabled && 'bg-gray-50',
          className
        )}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={buttonRef}
              id={id}
              type='button'
              variant='outline'
              role='combobox'
              aria-expanded={open}
              aria-haspopup='listbox'
              aria-controls={open ? `${name}-listbox` : undefined}
              aria-label={ariaLabel ?? name}
              disabled={disabled}
              onKeyDown={onTriggerKeyDown}
              className={cn(
                'h-[46px] w-full justify-between pr-10',
                disabled && 'opacity-60 cursor-not-allowed',
                error && 'border-destructive'
              )}
            >
              <span
                className={cn(
                  'truncate',
                  selected ? '' : 'text-black/55 font-[400]'
                )}
              >
                {renderValue ? renderValue(selected) : triggerText}
              </span>

              {/* 🔽 show arrow when nothing selected (same as your original) */}
              {!selected && (
                <IconChevronDown className='ml-1 size-4 opacity-50' />
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align='start'
            className={cn(
              'w-[var(--radix-popover-trigger-width)] p-0',
              contentClassName
            )}
          >
            <Command shouldFilter>
              <CommandInput
                placeholder='Search...'
                autoFocus
                disabled={disabled || loading}
              />
              <CommandList id={`${name}-listbox`} role='listbox'>
                {loading ? (
                  <div className='p-3 text-sm text-muted-foreground'>
                    กำลังโหลด…
                  </div>
                ) : (
                  <>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {safeOptions.map((opt) => {
                        const active = currentValue === opt.value;
                        const searchable = `${opt.label} ${opt.value}`;
                        return (
                          <CommandItem
                            key={opt.value}
                            value={searchable}
                            onSelect={() => handleSelect(opt.value)}
                            className='cursor-pointer'
                            aria-selected={active}
                            role='option'
                          >
                            <Check
                              className={cn(
                                'mr-2 size-4',
                                active ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {renderOption ? (
                              renderOption(opt, active)
                            ) : (
                              <span className='truncate'>{opt.label}</span>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* ❌ Clear button: only when there is a value, enabled, and onClear provided */}
        {!!currentValue && !disabled && onClear && (
          <button
            type='button'
            aria-label='Clear'
            className='absolute right-2 top-1/2 -translate-y-1/2 z-10 grid place-items-center'
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClear();
            }}
          >
            <X className='size-4 opacity-60 hover:opacity-100' />
          </button>
        )}
      </div>

      {error && <span className='text-red-500 text-xs pl-2 flex'>{error}</span>}
    </div>
  );
};

export default CustomSelect;
