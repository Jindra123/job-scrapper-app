import {Radio, cn, RadioProps as HerouiRadioProps} from "@heroui/react";

interface CustomRadioProps extends HerouiRadioProps {
  children?: React.ReactNode; // Include children for the content inside the Radio
}

export const CustomRadio = (props: CustomRadioProps) => {
  const {children, ...otherProps} = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        label: "font-semibold text-pink-500 text-center",
        control: "bg-pink-700",
        wrapper: cn(
          "border-zinc-500 transition-colors",
          "group-data-[hover-unselected=true]:bg-zinc-400",
          "group-data-[selected=true]:border-pink-700",
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default CustomRadio;