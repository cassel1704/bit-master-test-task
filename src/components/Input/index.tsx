import React from "react";
import { Input as AntdInput, Typography } from "antd";

interface IInput {
  className?: string;
  placeholder?: string;
  disabled: boolean;
  error: string | null;
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
}

const { Text: AntdText } = Typography;

const Input: React.FC<IInput> = ({
  placeholder,
  value,
  disabled,
  error,
  onChange,
  onEnter,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEnter();
    }
  };

  return (
    <div>
      <AntdInput
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {error && <AntdText type="danger">{error}</AntdText>}
    </div>
  );
};

export default Input;
