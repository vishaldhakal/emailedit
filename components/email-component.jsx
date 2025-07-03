"use client";

import React from "react";
import { TextBlock } from "./email-components/text-block";
import { Heading } from "./email-components/heading";
import { ImageComponent } from "./email-components/image";
import { ButtonComponent } from "./email-components/button";
import { Divider } from "./email-components/divider";
import { Spacer } from "./email-components/spacer";
import { SocialMedia } from "./email-components/social-media";
import { Navigation } from "./email-components/navigation";
import { SingleColumn } from "./email-components/layouts/single-column";
import { TwoColumns } from "./email-components/layouts/two-columns";
import { ThreeColumns } from "./email-components/layouts/three-columns";
import { FourColumns } from "./email-components/layouts/four-columns";

const componentMap = {
  "text-block": TextBlock,
  heading: Heading,
  image: ImageComponent,
  button: ButtonComponent,
  divider: Divider,
  spacer: Spacer,
  "social-media": SocialMedia,
  navigation: Navigation,
  "single-column": SingleColumn,
  "two-columns-50": TwoColumns,
  "two-columns-33-67": TwoColumns,
  "two-columns-67-33": TwoColumns,
  "three-columns": ThreeColumns,
  "four-columns": FourColumns,
};

export function EmailComponent({ type, data, isEditing, onUpdate, onCancel }) {
  const ComponentRenderer = componentMap[type];

  if (!ComponentRenderer) {
    return (
      <div className="border border-red-200 bg-red-50 text-red-700 rounded p-2">
        Unknown component type: {type}
      </div>
    );
  }

  if (isEditing && ComponentRenderer.Editor) {
    return (
      <ComponentRenderer.Editor
        data={data}
        onUpdate={onUpdate}
        onCancel={onCancel}
      />
    );
  }

  return <ComponentRenderer data={data} onUpdate={onUpdate} />;
}
