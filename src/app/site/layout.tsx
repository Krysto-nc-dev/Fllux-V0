import Navigation from "@/components/site/navigation";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <main className="h-full">
     <Navigation/>
      {children}
  </main>
  );
}
