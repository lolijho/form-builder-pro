import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface EmbedCodeGeneratorProps {
  formId: number;
}

export function EmbedCodeGenerator({ formId }: EmbedCodeGeneratorProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const baseUrl = window.location.origin;
  const formUrl = `${baseUrl}/form/${formId}`;

  const iframeCode = `<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  const embedScriptCode = `<div id="form-builder-${formId}"></div>
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${formUrl}';
    iframe.width = '100%';
    iframe.height = '600px';
    iframe.frameBorder = '0';
    iframe.style.border = 'none';
    document.getElementById('form-builder-${formId}').appendChild(iframe);
  })();
</script>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      toast.success("Codice copiato negli appunti!");
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>URL diretto del form</Label>
        <div className="flex gap-2 mt-2">
          <Textarea
            value={formUrl}
            readOnly
            rows={1}
            className="font-mono text-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(formUrl, "url")}
          >
            {copied === "url" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="iframe" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="iframe">iFrame</TabsTrigger>
          <TabsTrigger value="script">Script Embed</TabsTrigger>
        </TabsList>

        <TabsContent value="iframe" className="space-y-2">
          <Label>Codice iFrame</Label>
          <div className="flex gap-2">
            <Textarea
              value={iframeCode}
              readOnly
              rows={3}
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(iframeCode, "iframe")}
            >
              {copied === "iframe" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Copia e incolla questo codice nel tuo sito web per incorporare il
            form tramite iframe.
          </p>
        </TabsContent>

        <TabsContent value="script" className="space-y-2">
          <Label>Script Embed</Label>
          <div className="flex gap-2">
            <Textarea
              value={embedScriptCode}
              readOnly
              rows={8}
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(embedScriptCode, "script")}
            >
              {copied === "script" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Copia e incolla questo script nel tuo sito web per incorporare il
            form tramite JavaScript.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
