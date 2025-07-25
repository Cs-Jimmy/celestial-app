import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Play, Save, X } from "lucide-react";
import type { MissionLog } from "@shared/schema";

interface MissionLogEntryProps {
  entry: MissionLog;
  onEdit?: (id: string, updates: Partial<MissionLog>) => void;
  onDelete?: (id: string) => void;
}

const statusColors = {
  ongoing: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  challenging: "bg-red-500/20 text-red-400",
  breakthrough: "bg-yellow-500/20 text-yellow-400",
};

export function MissionLogEntry({ entry, onEdit, onDelete }: MissionLogEntryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content || "");
  const [editTitle, setEditTitle] = useState(entry.title);

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(entry.id, {
        title: editTitle,
        content: editContent,
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(entry.content || "");
    setEditTitle(entry.title);
    setIsEditing(false);
  };

  const playAudio = () => {
    if (entry.audioData) {
      const audio = new Audio(entry.audioData);
      audio.play();
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="font-mono text-sm text-yellow-400">
              Stardate {entry.stardate}
            </span>
            <Badge className={statusColors[entry.status as keyof typeof statusColors]}>
              {entry.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {entry.entryType === "voice" && entry.audioData && (
              <Button
                size="sm"
                variant="ghost"
                onClick={playAudio}
                className="text-yellow-400 hover:text-yellow-300"
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
            {!isEditing && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete?.(entry.id)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {isEditing && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveEdit}
                  className="text-green-400 hover:text-green-300"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 bg-white/10 rounded border border-white/20 focus:border-yellow-400 focus:outline-none"
              placeholder="Mission log title..."
            />
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-white/10 border-white/20 focus:border-yellow-400"
              rows={6}
              placeholder="Mission log content..."
            />
          </div>
        ) : (
          <>
            <h4 className="font-semibold mb-2">{entry.title}</h4>
            {entry.entryType === "text" ? (
              <div className="font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                {entry.content}
              </div>
            ) : (
              <div className="glass-panel p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">Voice Recording</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: "0%" }}></div>
                    </div>
                  </div>
                  {entry.audioDuration && (
                    <span className="font-mono text-sm">
                      {Math.floor(entry.audioDuration / 60)}:{(entry.audioDuration % 60).toFixed(0).padStart(2, '0')}
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>
            {entry.entryType === "text" ? "Text Entry" : "Voice Entry"}
            {entry.content && ` • ${entry.content.split(' ').length} words`}
          </span>
          <span>{format(new Date(entry.createdAt), "PPp")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
