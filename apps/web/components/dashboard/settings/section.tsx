export const Section = ({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) => (
    <div className="rounded-2xl w-full p-1.5 bg-neutral-500/10">
        <div className="rounded-xl shadow-sm bg-white/60 p-6 space-y-6">
            <div>
                <h2 className="text-lg font-semibold tracking-tight text-neutral-800">{title}</h2>
                <p className="text-sm text-neutral-500 tracking-tight mt-0.5">{description}</p>
            </div>
            {children}
        </div>
    </div>
);
