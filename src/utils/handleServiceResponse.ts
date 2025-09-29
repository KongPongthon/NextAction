import { redirect } from 'next/navigation';

export function handleServiceResponse(res: {
  success: boolean;
  code: number;
  message: string;
}) {
  if (res.success) {
    return true; // success → caller ทำงานต่อ
  }

  // จัดการ error ตาม code
  switch (res.code) {
    case 401:
      alert('คุณยังไม่ได้ login');
      redirect('/');
      break;
    case 404:
      alert('ไม่พบข้อมูล');
      break;
    default:
      alert(res.message);
  }

  return false; // มี error → caller หยุด
}
