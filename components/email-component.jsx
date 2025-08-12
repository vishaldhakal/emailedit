"use client";

import React from "react";
import { TextBlock } from "./email-components/text-block";
import { Heading } from "./email-components/heading";
import { ImageComponent } from "./email-components/image";
import { ButtonComponent } from "./email-components/button";
import { Divider } from "./email-components/divider";
import { Spacer } from "./email-components/spacer";
import { SocialMedia } from "./email-components/social-media";
import { Column } from "./email-components/layouts/column";
import { Link } from "./email-components/Link";
import { List } from "./email-components/list";
export const componentMap = {
  "text-block": TextBlock,
  heading: Heading,
  image: ImageComponent,
  button: ButtonComponent,
  divider: Divider,
  spacer: Spacer,
  "social-media": SocialMedia,
  column: Column,
  link: Link,
  list: List,
};

export function EmailComponent({
  type,
  data,
  onUpdate,
  setSelectedComponentId,
}) {
  const ComponentRenderer = componentMap[type];

  if (!ComponentRenderer) {
    return (
      <div className="border border-red-200 bg-red-50 text-red-700 rounded p-2">
        Unknown component type: {type}
      </div>
    );
  }

  return (
    <ComponentRenderer
      setSelectedComponentId={setSelectedComponentId}
      data={data}
      onUpdate={onUpdate}
    />
  );
}
