const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative mx-auto w-full min-h-screen max-w-6xl overflow-y-auto no-scrollbar py-20 flex flex-col md:border-x border-dashed border-neutral-300">
      <div className="flex-1 w-full md:border-y border-dashed md:bg-white/30 border-neutral-300 flex justify-center items-center">
        {children}
      </div>
    </div>
  );
};

export default Layout;
