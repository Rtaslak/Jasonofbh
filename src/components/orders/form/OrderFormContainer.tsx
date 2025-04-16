
import React, { ReactNode } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderFormContainerProps {
  children: ReactNode;
  title: string;
}

export function OrderFormContainer({ children, title }: OrderFormContainerProps) {
  return (
    <PageTransition>
      <div className="container mx-auto max-w-4xl p-6 md:p-8">
        <Card className="shadow-md border-muted/40">
          <CardHeader className="bg-secondary/30 rounded-t-lg pb-4">
            <CardTitle className="text-2xl font-bold text-foreground">
              {title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 pt-8">
            {children}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
