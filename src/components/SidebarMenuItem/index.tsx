
interface Props {
    text: string
    Icon: React.ComponentType<{ className?: string }>
    active?: boolean
}


export default function SidebarMenuItem({ text, Icon, active } : Props) {
    return (
      <div className="hoverEffect flex items-center text-slate-600 justify-center xl:justify-start text-lg space-x-3 p-3">
        <Icon className="h-7 " />
        <span className={`${active && "font-extrabold"} hidden xl:inline`}>{text}</span>
      </div>
    );
  }
  