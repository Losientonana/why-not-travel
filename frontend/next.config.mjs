/** @type {import('next').NextConfig} */
const nextConfig = {
  // 프로덕션 빌드 시 ESLint와 TypeScript 검사 활성화
  eslint: {
    // 개발 중에만 경고 무시하고, 배포 시에는 엄격하게 검사
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    // 개발 중에만 오류 무시하고, 배포 시에는 엄격하게 검사
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  images: {
    // Vercel 배포 시 이미지 최적화 활성화
    unoptimized: false,
  },
}

export default nextConfig
