<script setup lang="ts">
import { ROUTES } from "./constants/routes";

const localePath = useLocalePath();

const props = defineProps<{
  error: { statusCode: number };
}>();

if (props.error.statusCode === 404) {
  await navigateTo(localePath(ROUTES.TASKS), { redirectCode: 301 });
}
</script>
