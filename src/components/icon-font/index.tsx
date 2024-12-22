import { createFromIconfontCN } from "@ant-design/icons";
import { useAppSelector } from "../../hooks/useAppStore";

export const IconFont = (props: { type: string }) => {
  const { ICON_URL } = useAppSelector((state) => state.config);
  const FromIconFont = createFromIconfontCN({
    scriptUrl: ICON_URL,
  });

  return <FromIconFont type={props.type} />;
};

export default IconFont;
