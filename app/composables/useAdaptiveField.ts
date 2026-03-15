import type { Ref } from "vue";
import type {
  BaseFieldProps,
  GenericObject,
  FormContext,
  Path,
} from "vee-validate";

type FieldConfig = {
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validateOnInput?: boolean;
  validateOnModelUpdate?: boolean;
};

type DefineFieldFn<TValues extends GenericObject> =
  FormContext<TValues>["defineField"];

export function useAdaptiveField<TValues extends GenericObject>(
  defineField: DefineFieldFn<TValues>,
  errors: Ref<Partial<Record<keyof TValues, string | undefined>>>,
) {
  const baseConfig: FieldConfig = {
    validateOnBlur: true,
    validateOnChange: false,
    validateOnInput: false,
    validateOnModelUpdate: false,
  };

  return function <TKey extends keyof TValues & string>(
    name: TKey,
  ): [Ref<TValues[TKey]>, Ref<BaseFieldProps & GenericObject>] {
    return defineField(name as unknown as Path<TValues>, () => ({
      ...baseConfig,
      validateOnInput: !!errors.value[name],
    })) as [Ref<TValues[TKey]>, Ref<BaseFieldProps & GenericObject>];
  };
}
