// import React, { forwardRef } from 'react';
// import { cn } from '@/lib/utils';
// import { Input } from '../ui/input';

// export interface CustomInputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   error?: string;
//   containerClassName?: string;
//   saffixIcon?: React.ReactNode;
//   saffixIconClassName?: string;
//   /** number behavior when type="number" */
//   numericMode?: 'any' | 'int' | 'decimal'; // default: "any"
//   maxDecimals?: number; // for decimal mode (optional)
// }

// const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
//   (props, ref) => {
//     const {
//       label,
//       error,
//       containerClassName,
//       className,
//       disabled,
//       required,
//       placeholder,
//       type = 'text',
//       saffixIcon,
//       saffixIconClassName,
//       pattern,
//       title,
//       value,
//       onChange,
//       numericMode = 'any',
//       maxDecimals,
//       ...rest
//     } = props;

//     const blockBadKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
//       if (type !== 'number') return;
//       const badAlways = ['e', 'E', '+', '-'];
//       if (badAlways.includes(e.key)) return e.preventDefault();

//       if (numericMode === 'int' && e.key === '.') return e.preventDefault();

//       if (numericMode === 'decimal' && e.key === '.') {
//         const el = e.currentTarget;
//         if (el.value.includes('.')) return e.preventDefault();
//       }
//     };

//     const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//       if (type !== 'number') return;
//       let text = e.clipboardData.getData('text');
//       text = text.replace(/[eE+\-]/g, '');
//       if (numericMode === 'int') {
//         text = text.replace(/\D/g, '');
//       } else if (numericMode === 'decimal') {
//         text = text.replace(/[^0-9.]/g, '');
//         const firstDot = text.indexOf('.');
//         if (firstDot !== -1) {
//           text =
//             text.slice(0, firstDot + 1) +
//             text.slice(firstDot + 1).replace(/\./g, '');
//         }
//         if (typeof maxDecimals === 'number' && firstDot !== -1) {
//           const [intPart, fracPart = ''] = text.split('.');
//           text = intPart + '.' + fracPart.slice(0, maxDecimals);
//         }
//       }
//       e.preventDefault();
//       const el = e.currentTarget;
//       const start = el.selectionStart ?? el.value.length;
//       const end = el.selectionEnd ?? el.value.length;
//       el.setRangeText(text, start, end, 'end');
//       onChange?.({
//         ...({} as any),
//         target: el,
//         currentTarget: el,
//       } as React.ChangeEvent<HTMLInputElement>);
//     };

//     return (
//       <div className={cn('w-full', containerClassName)}>
//         <div className='relative'>
//           {label && (
//             <label
//               className={cn(
//                 'absolute top-[-11px] left-4 px-1 text-sm text-black bg-white! border-black z-10 rounded-sm tracking-wide',
//                 disabled && 'text-gray-500'
//               )}
//             >
//               {label} {required && <span className='text-red-500'>*</span>}
//             </label>
//           )}

//           <Input
//             ref={ref}
//             type={type}
//             required={required}
//             disabled={disabled}
//             placeholder={placeholder}
//             {...(type !== 'number' ? { pattern, title } : {})}
//             inputMode={
//               type === 'number'
//                 ? numericMode === 'int'
//                   ? 'numeric'
//                   : 'decimal'
//                 : undefined
//             }
//             className={cn(
//               'h-[46px]',
//               disabled && 'bg-gray-50!',
//               className,
//               error && 'border-red-500'
//             )}
//             onKeyDown={(e) => {
//               blockBadKey(e);
//               rest.onKeyDown?.(e);
//             }}
//             onPaste={(e) => {
//               handlePaste(e);
//               rest.onPaste?.(e);
//             }}
//             {...rest}
//             value={value ?? ''} // fix ให้ controlled ตลอด
//             onChange={onChange}
//           />

//           {saffixIcon && (
//             <div
//               className={cn(
//                 'absolute right-2 top-1/2 -translate-y-1/2',
//                 saffixIconClassName
//               )}
//             >
//               {saffixIcon}
//             </div>
//           )}
//         </div>

//         {error && (
//           <span className='text-red-500 text-xs pl-2 flex'>{error}</span>
//         )}
//       </div>
//     );
//   }
// );

// CustomInput.displayName = 'CustomInput';
// export default CustomInput;

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

export interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  saffixIcon?: React.ReactNode;
  saffixIconClassName?: string;
  /** number behavior when type="number" */
  numericMode?: 'any' | 'int' | 'decimal'; // default: "any"
  maxDecimals?: number; // for decimal mode (optional)
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (props, ref) => {
    const {
      label,
      error,
      containerClassName,
      className,
      disabled,
      required,
      placeholder,
      type = 'text',
      saffixIcon,
      saffixIconClassName,
      pattern,
      title,
      value,
      defaultValue,
      numericMode = 'any',
      maxDecimals,
      ...rest
    } = props;

    const isControlled = 'value' in props;
    const inputBinding = isControlled
      ? { value }
      : defaultValue !== undefined
      ? { defaultValue }
      : {};

    const blockBadKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type !== 'number') return;
      const badAlways = ['e', 'E', '+', '-'];
      if (badAlways.includes(e.key)) return e.preventDefault();

      if (numericMode === 'int' && e.key === '.') return e.preventDefault();

      if (numericMode === 'decimal' && e.key === '.') {
        const el = e.currentTarget;
        // disallow second dot
        if (el.value.includes('.')) return e.preventDefault();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (type !== 'number') return;
      let text = e.clipboardData.getData('text');
      // remove signs and exponent chars
      text = text.replace(/[eE+\-]/g, '');
      if (numericMode === 'int') {
        // keep digits only
        text = text.replace(/\D/g, '');
      } else if (numericMode === 'decimal') {
        // keep digits and only a single '.'
        text = text.replace(/[^0-9.]/g, '');
        const firstDot = text.indexOf('.');
        if (firstDot !== -1) {
          // remove any additional dots
          text =
            text.slice(0, firstDot + 1) +
            text.slice(firstDot + 1).replace(/\./g, '');
        }
        if (typeof maxDecimals === 'number' && firstDot !== -1) {
          const [intPart, fracPart = ''] = text.split('.');
          text = intPart + '.' + fracPart.slice(0, maxDecimals);
        }
      } else {
        // numericMode === "any": still remove e/E/+/- to avoid scientific notation
        text = text.replace(/[eE+\-]/g, '');
      }
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;
      const next = el.value.slice(0, start) + text + el.value.slice(end);
      el.setRangeText(text, start, end, 'end');
      // If controlled, call onChange so parent state updates
      props.onChange?.({
        ...({} as any),
        target: el,
        currentTarget: el,
        // minimal synthetic event shape for RHF
      } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <div className={cn('w-full', containerClassName)}>
        <div className='relative'>
          {label && (
            <label
              className={cn(
                'absolute top-[-11px] left-4 px-1 text-sm text-black bg-white! border-black z-10 rounded-sm tracking-wide',
                disabled && 'text-gray-500'
              )}
            >
              {label} {required && <span className='text-red-500'>*</span>}
            </label>
          )}

          <Input
            ref={ref}
            type={type}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            // keep your pattern/title only for text fields; remove default pattern that blocks Thai
            {...(type !== 'number' ? { pattern, title } : {})}
            inputMode={
              type === 'number'
                ? numericMode === 'int'
                  ? 'numeric'
                  : 'decimal'
                : undefined
            }
            className={cn(
              'h-[46px]',
              disabled && 'bg-gray-50!',
              className,
              error && 'border-red-500'
            )}
            onKeyDown={(e) => {
              blockBadKey(e);
              rest.onKeyDown?.(e);
            }}
            onPaste={(e) => {
              handlePaste(e);
              rest.onPaste?.(e);
            }}
            {...rest}
            {...inputBinding}
          />

          {saffixIcon && (
            <div
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2',
                saffixIconClassName
              )}
            >
              {saffixIcon}
            </div>
          )}
        </div>

        {error && (
          <span className='text-red-500 text-xs pl-2 flex'>{error}</span>
        )}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';
export default CustomInput;
