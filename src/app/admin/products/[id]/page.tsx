import { ProductForm } from '../product-form';

export default function AdminEditProductPage({
  params,
}: Readonly<{ params: { id: string } }>) {
  return <ProductForm mode="edit" productId={params.id} />;
}
