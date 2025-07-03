"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmailComponent } from "@/components/email-component";

export function FourColumns({ data, onUpdate }) {
  const {
    columnWidth,
    backgroundColor,
    padding,
    gap,
    column1Components = [],
    column2Components = [],
    column3Components = [],
    column4Components = [],
  } = data;

  const [dragOver, setDragOver] = useState(null);

  const handleDragOver = (e, column) => {
    e.preventDefault();
    setDragOver(column);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = (e, column) => {
    e.preventDefault();
    setDragOver(null);
    try {
      const componentData = JSON.parse(
        e.dataTransfer.getData("application/json")
      );
      const newComponent = {
        type: componentData.type,
        data: componentData.defaultData,
      };

      if (column === 1) {
        const newComponents = [...column1Components, newComponent];
        onUpdate({ ...data, column1Components: newComponents });
      } else if (column === 2) {
        const newComponents = [...column2Components, newComponent];
        onUpdate({ ...data, column2Components: newComponents });
      } else if (column === 3) {
        const newComponents = [...column3Components, newComponent];
        onUpdate({ ...data, column3Components: newComponents });
      } else {
        const newComponents = [...column4Components, newComponent];
        onUpdate({ ...data, column4Components: newComponents });
      }
    } catch (error) {
      console.error("Error parsing dropped component:", error);
    }
  };

  return (
    <div
      style={{
        backgroundColor,
        padding,
      }}
      className="border border-border rounded-lg"
    >
      <div className="flex" style={{ gap: gap || "20px" }}>
        <div
          style={{ width: columnWidth }}
          className={`border-2 border-dashed rounded p-4 text-center text-muted-foreground ${
            dragOver === 1 ? "border-primary" : "border-border"
          }`}
          data-column-id="1"
        >
          {column1Components.length === 0 ? (
            <>
              <div className="text-xl mb-2">📄</div>
              <div>Column 1</div>
              <div className="text-sm">Drop content here</div>
            </>
          ) : (
            column1Components.map((component, index) => (
              <EmailComponent
                key={`${component.type}-${index}`}
                type={component.type}
                data={component.data}
                onUpdate={(updatedData) => {
                  const newComponents = [...column1Components];
                  newComponents[index] = {
                    ...newComponents[index],
                    data: updatedData,
                  };
                  onUpdate({ ...data, column1Components: newComponents });
                }}
              />
            ))
          )}
        </div>
        <div
          style={{ width: columnWidth }}
          className={`border-2 border-dashed rounded p-4 text-center text-muted-foreground ${
            dragOver === 2 ? "border-primary" : "border-border"
          }`}
          data-column-id="2"
        >
          {column2Components.length === 0 ? (
            <>
              <div className="text-xl mb-2">📄</div>
              <div>Column 2</div>
              <div className="text-sm">Drop content here</div>
            </>
          ) : (
            column2Components.map((component, index) => (
              <EmailComponent
                key={`${component.type}-${index}`}
                type={component.type}
                data={component.data}
                onUpdate={(updatedData) => {
                  const newComponents = [...column2Components];
                  newComponents[index] = {
                    ...newComponents[index],
                    data: updatedData,
                  };
                  onUpdate({ ...data, column2Components: newComponents });
                }}
              />
            ))
          )}
        </div>
        <div
          style={{ width: columnWidth }}
          className={`border-2 border-dashed rounded p-4 text-center text-muted-foreground ${
            dragOver === 3 ? "border-primary" : "border-border"
          }`}
          data-column-id="3"
        >
          {column3Components.length === 0 ? (
            <>
              <div className="text-xl mb-2">📄</div>
              <div>Column 3</div>
              <div className="text-sm">Drop content here</div>
            </>
          ) : (
            column3Components.map((component, index) => (
              <EmailComponent
                key={`${component.type}-${index}`}
                type={component.type}
                data={component.data}
                onUpdate={(updatedData) => {
                  const newComponents = [...column3Components];
                  newComponents[index] = {
                    ...newComponents[index],
                    data: updatedData,
                  };
                  onUpdate({ ...data, column3Components: newComponents });
                }}
              />
            ))
          )}
        </div>
        <div
          style={{ width: columnWidth }}
          className={`border-2 border-dashed rounded p-4 text-center text-muted-foreground ${
            dragOver === 4 ? "border-primary" : "border-border"
          }`}
          data-column-id="4"
        >
          {column4Components.length === 0 ? (
            <>
              <div className="text-xl mb-2">📄</div>
              <div>Column 4</div>
              <div className="text-sm">Drop content here</div>
            </>
          ) : (
            column4Components.map((component, index) => (
              <EmailComponent
                key={`${component.type}-${index}`}
                type={component.type}
                data={component.data}
                onUpdate={(updatedData) => {
                  const newComponents = [...column4Components];
                  newComponents[index] = {
                    ...newComponents[index],
                    data: updatedData,
                  };
                  onUpdate({ ...data, column4Components: newComponents });
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

FourColumns.Editor = function FourColumnsEditor({ data, onUpdate, onCancel }) {
  const [formData, setFormData] = useState(data);

  const handleSave = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="columnWidth">Column Width</Label>
          <Select
            value={formData.columnWidth}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, columnWidth: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20%">20%</SelectItem>
              <SelectItem value="22%">22%</SelectItem>
              <SelectItem value="25%">25%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="gap">Column Gap</Label>
          <Select
            value={formData.gap || "20px"}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, gap: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10px">Small</SelectItem>
              <SelectItem value="15px">Medium</SelectItem>
              <SelectItem value="20px">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="padding">Padding</Label>
          <Select
            value={formData.padding}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, padding: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0px">None</SelectItem>
              <SelectItem value="10px">Small</SelectItem>
              <SelectItem value="20px">Medium</SelectItem>
              <SelectItem value="30px">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={formData.backgroundColor}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                backgroundColor: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <Label>Preview</Label>
        <div className="mt-2">
          <div
            style={{
              backgroundColor: formData.backgroundColor,
              padding: formData.padding,
            }}
            className="border border-border rounded-lg"
          >
            <div className="flex" style={{ gap: formData.gap || "20px" }}>
              <div
                style={{ width: formData.columnWidth }}
                className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground"
              >
                <div className="text-xl mb-2">📄</div>
                <div>Column 1</div>
              </div>
              <div
                style={{ width: formData.columnWidth }}
                className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground"
              >
                <div className="text-xl mb-2">📄</div>
                <div>Column 2</div>
              </div>
              <div
                style={{ width: formData.columnWidth }}
                className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground"
              >
                <div className="text-xl mb-2">📄</div>
                <div>Column 3</div>
              </div>
              <div
                style={{ width: formData.columnWidth }}
                className="border-2 border-dashed border-border rounded p-4 text-center text-muted-foreground"
              >
                <div className="text-xl mb-2">📄</div>
                <div>Column 4</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};
