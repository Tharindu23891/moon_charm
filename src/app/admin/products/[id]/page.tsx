import { ProductForm } from '../product-form';

export default async function AdminEditProductPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  return <ProductForm mode="edit" productId={id} />;
}
