"use client";

import React from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import Link from "next/link";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-secondary-500 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={<CheckCheck className="h-4 w-4" />}
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500 font-medium">
              No notifications yet
            </p>
            <p className="text-sm text-secondary-400 mt-1">
              You will be notified about campaign activities here.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              padding="sm"
              className={!n.read ? "border-l-4 border-l-primary-500" : ""}
            >
              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => {
                  if (!n.read) markAsRead(n.id);
                }}
              >
                <div className="shrink-0 mt-0.5">
                  {!n.read ? (
                    <div className="h-2.5 w-2.5 rounded-full bg-primary-500" />
                  ) : (
                    <div className="h-2.5 w-2.5 rounded-full bg-secondary-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm ${
                        !n.read
                          ? "font-semibold text-secondary-900"
                          : "font-medium text-secondary-700"
                      }`}
                    >
                      {n.title}
                    </p>
                    {!n.read && (
                      <Badge variant="info" size="sm">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-secondary-500 mt-0.5">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-secondary-400">
                      {timeAgo(n.createdAt)}
                    </span>
                    {n.link && (
                      <Link
                        href={n.link}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
