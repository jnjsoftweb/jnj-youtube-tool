import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>YouTube 구독 관리 도구</h1>
      <Link href="/auth/google">Google로 로그인</Link>
    </div>
  );
}
