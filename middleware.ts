import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // อ่านข้อมูลการล็อกอินที่ส่งมา
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    // ถอดรหัส Username และ Password
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // ตรวจสอบความถูกต้องกับไฟล์ .env
    if (user === process.env.ADMIN_USERNAME && pwd === process.env.ADMIN_PASSWORD) {
      return NextResponse.next(); // รหัสถูก ปล่อยผ่านเข้าเว็บ
    }
  }

  // ถ้ารหัสผิด หรือเพิ่งเข้ามาครั้งแรก ให้ส่งคำสั่งเด้งหน้าต่างล็อกอิน
  return new NextResponse('ต้องเข้าสู่ระบบก่อนใช้งาน', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
    },
  });
}

// กำหนดว่าหน้าไหนบ้างที่ต้องติดรหัสผ่าน (หน้าหลัก และ หน้า users)
export const config = {
  matcher: ['/', '/users'],
};