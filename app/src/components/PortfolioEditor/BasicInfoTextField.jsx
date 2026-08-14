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
  onValueCommit,
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    e => {
      setLocalValue(e.target.value);
    },
    [],
  );

  const handleBlur = useCallback(
    () => {
      onValueCommit(name, localValue);
    },
    [name, localValue, onValueCommit],
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
        onBlur={handleBlur}
        sx={formInputSx}
      />
    </FormControl>
  );
}

export default memo(BasicInfoTextField);
