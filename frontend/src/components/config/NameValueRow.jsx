export const NameValueRow = ({
  name,
  value,
  valueColor = "gray-300",
}) => {
  return (
    <div className="flex flex-row w-full items-baseline text-sm">
      <div className="grow shrink-0 text-gray-500">{name}</div>
      <div className={`text-xs shrink text-${valueColor} text-right`}>
        {value}
      </div>
    </div>
  );
};
