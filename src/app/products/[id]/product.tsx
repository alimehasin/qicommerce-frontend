"use client";

import { constructImageUrl } from "@/app/utils/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProductServerType } from "@/types/products";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function Product({ product }: { product: ProductServerType }) {
  const [selectedImage, setSelectedImage] = useState(product.image_path);

  const handleImageSelect = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const handleKeyDown = (e: React.KeyboardEvent, imagePath: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleImageSelect(imagePath);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              fill
              priority
              alt={product.name}
              className="object-contain"
              src={constructImageUrl(selectedImage)}
            />
          </div>
          {product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                className="relative aspect-square cursor-pointer rounded-lg overflow-hidden p-0 border-0 bg-transparent"
                onClick={() => handleImageSelect(product.image_path)}
              >
                <Image
                  src={constructImageUrl(product.image_path)}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </button>
              {product.images.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  className="relative aspect-square cursor-pointer rounded-lg overflow-hidden p-0 border-0 bg-transparent"
                  onClick={() => handleImageSelect(image.image_path)}
                >
                  <Image
                    src={constructImageUrl(image.image_path)}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-2">SKU: {product.sku}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <Badge
              variant={product.stock > 0 ? "default" : "destructive"}
              className="text-sm"
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          <div className="prose prose-sm text-gray-600">
            <p>{product.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button size="lg" className="flex-1" disabled={product.stock === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-900">
              Product Details
            </h3>
            <dl className="mt-4 space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Status</dt>
                <dd className="text-sm text-gray-900">{product.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Stock</dt>
                <dd className="text-sm text-gray-900">{product.stock} units</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
