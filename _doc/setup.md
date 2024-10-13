## next.js, shadcn/ui

```sh
# create next project
npx create-next-app@latest jnj-youtube-tool

cd jnj-youtube-tool

# shadcn-ui 설치
npx shadcn@latest init

# button 컴포넌트 생성
# npx shadcn@latest add button
```

## github

```sh
cd /Users/youchan/Dev/Jnj-soft/Projects/internal/jnj-youtube-tool
github -e pushRepo -u jnjsoftweb -n jnj-youtube-tool -d "Youtube Tool By NEXT.JS"

# delete repo
github -e deleteRepo -u jnjsoftkmc -n jnj-youtube-tool
```

## shadcn-ui

```
# button 컴포넌트 생성
npx shadcn@latest add card
```

## button 컴포넌트 테스트

> `src/app/(test)/shadcn/button/page.tsx`

```tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
```