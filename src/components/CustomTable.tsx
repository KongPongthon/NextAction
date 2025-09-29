'use client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import moment from 'moment';
import { cn } from '@/lib/utils';
// import { useLanguage } from '@/contexts/LanguageContext';
import {
  IconChevronLeft,
  IconChevronLeftPipe,
  IconChevronRight,
  IconChevronRightPipe,
  IconDotsVertical,
} from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export interface TableColumn<T> {
  key: keyof T | (keyof T)[];
  name: string;
  type?:
    | 'default'
    | 'date'
    | 'datetime'
    | 'check'
    | 'rowActions'
    | 'dropdownActions'
    | 'menu'
    | 'permissions'
    | 'number';
  align?: 'left' | 'center' | 'right';
  alignY?: 'start' | 'center' | 'end';
  headerAlign?: 'left' | 'center' | 'right';
  sliceText?: number;
  minWidth?: string;
  render?: (value: any, row: T) => React.ReactNode;
  renderCustom?: (item: T) => React.ReactNode;
  onMoveOutClick?: (item: T) => void;
}

interface CustomTableProps<T> {
  data: T[];
  totalItems?: number;
  columns: TableColumn<T>[];
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (val: number) => void;
  actions?: {
    name: string | React.ReactNode;
    onClick: (item: T) => void;
    isDisabled?: boolean;
    icon?: React.ReactNode;
  }[];
  caption?: string;
  onDropdownButtonClick?: (item: T) => void;
  loading?: boolean;
  setLastPage?: boolean;
  showPagination?: boolean;
  onPreviewFile?: (filePath: string) => void;
}

const rowOptions = [10, 25, 50];

export function CustomTable<T>({
  data,
  totalItems,
  columns,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  actions = [],
  caption = '',
  onDropdownButtonClick,
  setLastPage = true,
  showPagination = true,
}: CustomTableProps<T>) {
  //   const { language } = useLanguage();

  //console.log('showPagination', showPagination);

  const renderValue = (item: T, col: TableColumn<T>) => {
    const value = Array.isArray(col.key)
      ? col.key.map((k) => item[k])
      : item[col.key];
    switch (col.type) {
      case 'date':
        console.log('col', col.alignY);

        if (
          !value ||
          value === null ||
          value === undefined ||
          (Array.isArray(value) && value.length === 0)
        )
          return '-';
        if (Array.isArray(value) && value.length === 2) {
          const isValidDateStart = moment(
            value[0] as moment.MomentInput
          ).isValid();
          const isValidDateEnd = moment(
            value[1] as moment.MomentInput
          ).isValid();
          if (!value[0] && !value[1]) return '-';
          const startDate = moment(value[0] as moment.MomentInput)
            .add(543, 'years')
            .format('DD/MM/YYYY');

          const endDate = moment(value[1] as moment.MomentInput)
            .add(543, 'years')
            .format('DD/MM/YYYY');

          return `${isValidDateStart ? startDate : ''} ${
            isValidDateStart && isValidDateEnd ? '-' : ''
          } ${isValidDateEnd ? endDate : ''}`;
        }
        if (Array.isArray(value) && value.length === 1) {
          return moment(value[0] as moment.MomentInput).format('DD/MM/YYYY');
        }
        return !value
          ? '-'
          : moment(value as moment.MomentInput)
              ?.add(543, 'years')
              ?.format('DD/MM/YYYY');
      case 'datetime':
        if (Array.isArray(value) && value.length === 2) {
          const [start, end] = value;
          return `${moment(start as moment.MomentInput).format(
            'DD/MM/YYYY'
          )} - ${moment(end as moment.MomentInput).format('DD/MM/YYYY')}`;
        }
        if (!Array.isArray(value)) {
          return value
            ? moment(value as moment.MomentInput).format('DD/MM/YYYY HH:mm:ss')
            : '-';
        }
        return '-';
      case 'rowActions':
        return (
          <div className='flex gap-2 justify-center'>
            {actions.map((a, i) => {
              //! a.isDisabled && (
              // ถ้าไม่ disabled ถึง render ปุ่ม
              //   <button
              //     key={i}
              //     onClick={() => a.onClick(item)}
              //     className='hover:text-black transition-colors'
              //   >
              //     {a.icon}
              //   </button>
              // )
              const { isDisabled = false } = a; // ✅ ตั้ง default
              return (
                !isDisabled && (
                  <button
                    key={i}
                    onClick={() => a.onClick(item)}
                    className='hover:text-black transition-colors'
                  >
                    {a.icon}
                  </button>
                )
              );
            })}
          </div>
        );
      case 'dropdownActions': {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDropdownButtonClick?.(item);
                }}
              >
                <span className='hover:cursor-pointer inline-flex'>
                  <IconDotsVertical stroke={2} />
                </span>
              </a>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {actions?.map((a, i) => (
                <DropdownMenuItem
                  key={i}
                  onClick={() => a.onClick(item)} // ทำงานเหมือน antd
                >
                  {a.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
      case 'number': {
        return value;
      }
      default: {
        let text = typeof value === 'string' ? value : JSON.stringify(value);

        if (value === null) {
          text = '-';
        }

        if (+value === 0) {
          text = '-';
        }

        return col.sliceText ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className='cursor-default'>
                  {text?.length > col.sliceText
                    ? text?.slice(0, col.sliceText)
                    : text}
                  {text?.length > col.sliceText && '...'}
                </span>
              </TooltipTrigger>
              <TooltipContent>{text}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          text || '-'
        );
      }
    }
  };

  return (
    <div className={`space-y-4 w-full`}>
      <div className='overflow-x-auto w-full'>
        <Table className='table-auto'>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader className='border-b border-gray-300'>
            <TableRow>
              <TableHead className='font-bold tracking-wider text-center'>
                {/* {lang === 'th' ? '' : 'No.'} */}
                ลำดับ
              </TableHead>
              {columns.map((col, idx) => (
                <TableHead
                  key={idx}
                  className={cn(
                    'font-bold tracking-wider text-[14px]',
                    `text-${col.headerAlign || col.align || 'center'}`,
                    col.minWidth && `min-w-[${col.minWidth}]`
                  )}
                >
                  {col.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className='border-b border-gray-300 gap-10'>
            {data.map((item, i) => (
              <TableRow key={i} className='hover:bg-gray-50 border-gray-300'>
                <TableCell className='text-center tracking-wide font-light py-4'>
                  {page * rowsPerPage + i + 1}
                </TableCell>
                {columns.map((col, idx) => (
                  <TableCell
                    key={idx}
                    className={cn(
                      'text-center tracking-wide font-light py-3',
                      col.align && `text-${col.align}`,
                      col.alignY && `flex items-${col.alignY}`
                    )}
                  >
                    {renderValue(item, col) as React.ReactNode}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data.length > 0 && showPagination && (
        <div className={cn(`flex justify-end items-center `)}>
          <div className='flex gap-2 items-center overflow-x-auto'>
            <span className={`text-sm text-nowrap `}>
              {/* {lang === 'th' ? 'จำนวนรายการต่อหน้า' : 'Rows per page:'} */}
              จำนวนรายการต่อหน้า
            </span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(val) => onRowsPerPageChange(Number(val))}
            >
              <SelectTrigger className='w-[70px] h-[30px] bg-white border-0 shadow-none'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {rowOptions.map((opt) => (
                  <SelectItem key={opt} value={opt.toString()}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className='text-sm text-nowrap'>
              {`${page * rowsPerPage + 1}-${Math.min(
                (page + 1) * rowsPerPage,
                totalItems ?? data.length
              )} 
              จาก
              ${totalItems ?? data.length}`}
            </div>
            {setLastPage && (
              <Button
                size='sm'
                variant='ghost'
                onClick={() => onPageChange(0)}
                disabled={page === 0}
              >
                {/* <IoIosArrowBack className="text-gray-800" /> */}
                <IconChevronLeftPipe stroke={2} />
              </Button>
            )}

            <Button
              size='sm'
              variant='ghost'
              onClick={() => onPageChange(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              {/* <IoIosArrowBack className="text-gray-800" /> */}
              <IconChevronLeft stroke={2} />
            </Button>
            <Button
              size='lg'
              variant='ghost'
              onClick={() => onPageChange(page + 1)}
              disabled={(page + 1) * rowsPerPage >= (totalItems ?? data.length)}
            >
              {/* <IoIosArrowForward className="text-gray-800" /> */}
              <IconChevronRight stroke={2} />
            </Button>
            {setLastPage && (
              <Button
                size='sm'
                variant='ghost'
                onClick={() =>
                  onPageChange(
                    Math.ceil((totalItems ?? data.length) / rowsPerPage) - 1
                  )
                }
                disabled={
                  (page + 1) * rowsPerPage >= (totalItems ?? data.length)
                }
              >
                {/* <IoIosArrowForward className="text-gray-800" /> */}
                <IconChevronRightPipe stroke={2} />
              </Button>
            )}
          </div>
        </div>
      )}

      {data.length === 0 && (
        <div className='text-center'>
          {/* {lang === 'th' ? 'ไม่พบข้อมูล' : 'No data'} */}
          ไม่พบข้อมูล
        </div>
      )}
    </div>
  );
}
