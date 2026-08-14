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
  // 입력 중인 텍스트를 로컬 상태로 들고 있다가 blur 시점에만 부모 formData로 반영
  const [localValue, setLocalValue] = useState(value);
  const feedbackId = feedback ? `${id}-feedback` : undefined;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // 사용자가 입력하는 동안에는 이 컴포넌트 내부 값만 갱신해 에디터 전체 리렌더링을 줄인다.
  const handleChange = useCallback(
    e => {
      setLocalValue(e.target.value);
    },
    [],
  );

  // 입력창에서 포커스가 빠질 때 최종 값을 부모 상태에 반영한다.
  const handleBlur = useCallback(
    () => {
      onValueCommit(name, localValue);
    },
    [name, localValue, onValueCommit],
  );

  return (
    <FormControl fullWidth required={required} error={Boolean(feedback)}>
      <FieldLabel htmlFor={id} required={required} feedback={feedback} feedbackId={feedbackId} sx={fieldLabelSx}>
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
        slotProps={{
          input: {
            "aria-invalid": Boolean(feedback),
            "aria-describedby": feedbackId,
          },
        }}
        sx={formInputSx}
      />
    </FormControl>
  );
}

export default memo(BasicInfoTextField);
