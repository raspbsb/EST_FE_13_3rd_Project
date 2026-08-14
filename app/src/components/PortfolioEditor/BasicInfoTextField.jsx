import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { memo, useCallback, useEffect, useState } from "react";
import FieldLabel from "./FieldLabel";

function BasicInfoTextField({
  id,
  name,
  label,
  value,
  required = false,
  feedback = "",
  fieldLabelSx,
  formInputSx,
  className,
  multiline = false,
  minRows,
  onValueChange,
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    e => {
      const nextValue = e.target.value;

      setLocalValue(nextValue);
      onValueChange(name, nextValue);
    },
    [name, onValueChange],
  );

  return (
    <FormControl fullWidth required={required}>
      <FieldLabel htmlFor={id} required={required} feedback={feedback} sx={fieldLabelSx}>
        {label}
      </FieldLabel>

      <OutlinedInput
        className={className}
        id={id}
        name={name}
        size="small"
        multiline={multiline}
        minRows={minRows}
        value={localValue}
        onChange={handleChange}
        sx={formInputSx}
      />
    </FormControl>
  );
}

export default memo(BasicInfoTextField);
