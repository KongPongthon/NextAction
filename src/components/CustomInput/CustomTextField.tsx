import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

interface CustomTextFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // 👈 use Textarea attrs
  containerClassName?: string;
  label?: string;
  error?: string;
  textFieldClassName?: string;
  rows?: number; // initial rows
  minRows?: number; // 👈 new
  maxRows?: number; // 👈 optional
  autoResize?: boolean; // 👈 default true
}

const CustomTextField = ({
  containerClassName,
  label,
  disabled,
  required,
  placeholder,
  error,
  textFieldClassName,
  rows = 3,
  minRows = 3,
  maxRows,
  autoResize = true,
  value,
  onChange,
  ...rest
}: CustomTextFieldProps) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!autoResize || !ref.current) return;

    const el = ref.current;
    const cs = window.getComputedStyle(el);
    const lineHeight = parseFloat(cs.lineHeight || '20');
    const borderY =
      parseFloat(cs.borderTopWidth || '0') +
      parseFloat(cs.borderBottomWidth || '0');
    const paddingY =
      parseFloat(cs.paddingTop || '0') + parseFloat(cs.paddingBottom || '0');

    const minH = minRows * lineHeight + paddingY + borderY;
    const maxH = maxRows ? maxRows * lineHeight + paddingY + borderY : Infinity;

    const resize = () => {
      el.style.height = 'auto'; // reset to measure
      const next = Math.min(Math.max(el.scrollHeight, minH), maxH);
      el.style.height = `${next}px`;
    };

    resize();

    // Also resize on input
    const onInput = () => resize();
    el.addEventListener('input', onInput);
    return () => el.removeEventListener('input', onInput);
  }, [autoResize, minRows, maxRows, value]);

  return (
    <div className={cn('w-full', containerClassName)}>
      <div className='relative'>
        {label && (
          <label
            className={cn(
              'absolute top-[-11px] left-4 px-1 text-sm text-black bg-white z-10 rounded-sm tracking-wide',
              disabled && 'text-gray-500'
            )}
          >
            {label} {required && <span className='text-red-500'>*</span>}
          </label>
        )}

        <Textarea
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
          // Important: remove default min height so our JS minRows works
          className={cn(
            'p-4 h-auto min-h-0 resize-none', // 👈 no manual resize; JS handles it
            error && 'border-red-500',
            textFieldClassName
          )}
          autoComplete='off'
          rows={rows} // initial size only
          value={value}
          onChange={onChange}
          {...rest}
        />
      </div>
      {error && <span className='text-red-500 text-xs pl-2 flex'>{error}</span>}
    </div>
  );
};

export default CustomTextField;
