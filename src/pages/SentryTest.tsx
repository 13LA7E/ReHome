import * as Sentry from "@sentry/react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Bug, Zap, Users, Info, BarChart3 } from "lucide-react";
import { toast } from "sonner";

export default function SentryTest() {
  // Test 1: Basic Error
  const testBasicError = () => {
    toast.info("Triggering basic error...");
    setTimeout(() => {
      throw new Error("Test Error: This is a sample error to test Sentry integration!");
    }, 100);
  };

  // Test 2: Caught Error with Context
  const testCaughtError = () => {
    try {
      toast.info("Triggering caught error with context...");
      // Simulate an API error
      const data = JSON.parse('{"invalid json}');
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          test_type: "caught_error",
          severity: "medium"
        },
        contexts: {
          test: {
            description: "Manual error test from Sentry Test page",
            timestamp: new Date().toISOString()
          }
        }
      });
      toast.success("Error sent to Sentry with context!");
    }
  };

  // Test 3: Custom Message
  const testCustomMessage = () => {
    toast.info("Sending custom message...");
    Sentry.captureMessage("Custom Test Message: Sentry is working correctly!", {
      level: "info",
      tags: {
        test_type: "custom_message"
      }
    });
    toast.success("Custom message sent to Sentry!");
  };

  // Test 4: User Feedback
  const testUserFeedback = () => {
    toast.info("Opening user feedback dialog...");
    const eventId = Sentry.captureMessage("User triggered feedback test");
    Sentry.showReportDialog({ 
      eventId,
      title: "It looks like we're having issues.",
      subtitle: "Our team has been notified.",
      subtitle2: "If you'd like to help, tell us what happened below."
    });
  };

  // Test 5: Performance Transaction
  const testPerformance = async () => {
    toast.info("Testing performance monitoring...");
    
    // Simulate slow operation with a span
    await Sentry.startSpan(
      {
        name: "Test Performance Transaction",
        op: "test"
      },
      async (span) => {
        await Sentry.startSpan(
          {
            name: "Simulated slow database query",
            op: "slow_operation"
          },
          async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        );
      }
    );
    
    toast.success("Performance data sent to Sentry!");
  };

  // Test 6: Breadcrumbs
  const testBreadcrumbs = () => {
    toast.info("Testing breadcrumbs...");
    
    Sentry.addBreadcrumb({
      category: "user_action",
      message: "User clicked test button",
      level: "info"
    });

    Sentry.addBreadcrumb({
      category: "navigation",
      message: "User navigated to Sentry Test page",
      level: "info"
    });

    Sentry.addBreadcrumb({
      category: "api",
      message: "Simulated API call to /api/test",
      level: "info",
      data: {
        url: "/api/test",
        method: "GET",
        status_code: 200
      }
    });

    // Now trigger an error to see all breadcrumbs
    setTimeout(() => {
      throw new Error("Test Error with Breadcrumbs: Check the breadcrumbs leading to this error!");
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Bug className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Sentry Error Tracking Test</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Test Sentry integration by triggering different types of errors and events.
              Check your Sentry dashboard to see them appear in real-time!
            </p>
          </div>

          <Card className="mb-6 border-amber-500/50 bg-amber-500/5">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <CardTitle className="text-amber-900 dark:text-amber-100">
                    Development Tool Only
                  </CardTitle>
                  <CardDescription className="text-amber-800 dark:text-amber-200">
                    This page is for testing purposes. Remove it or protect it before going to production!
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Basic Error
                </CardTitle>
                <CardDescription>
                  Throws an uncaught error. This will appear in Sentry's Issues tab.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={testBasicError} variant="destructive" className="w-full">
                  Trigger Error
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5" />
                  Caught Error
                </CardTitle>
                <CardDescription>
                  Catches and reports an error with custom context and tags.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={testCaughtError} variant="outline" className="w-full">
                  Test Caught Error
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Custom Message
                </CardTitle>
                <CardDescription>
                  Sends a custom info message to Sentry (not an error).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={testCustomMessage} variant="outline" className="w-full">
                  Send Message
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Feedback
                </CardTitle>
                <CardDescription>
                  Opens Sentry's user feedback dialog to collect user reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={testUserFeedback} variant="outline" className="w-full">
                  Test Feedback
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance
                </CardTitle>
                <CardDescription>
                  Measures a slow operation (2s delay) and sends performance data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={testPerformance} variant="outline" className="w-full">
                  Test Performance
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Breadcrumbs
                </CardTitle>
                <CardDescription>
                  Creates breadcrumbs, then triggers error. See the trail in Sentry.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={testBreadcrumbs} variant="destructive" className="w-full">
                  Test Breadcrumbs
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>📊 What to Check in Sentry Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Issues Tab</h3>
                <p className="text-sm text-muted-foreground">
                  All errors will appear here. Click any error to see:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 ml-4">
                  <li>Stack trace showing exact line number</li>
                  <li>Breadcrumbs (user actions before error)</li>
                  <li>User context and device info</li>
                  <li>Error frequency and affected users</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Performance Tab</h3>
                <p className="text-sm text-muted-foreground">
                  Performance data will show transaction duration and slow operations.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Session Replay</h3>
                <p className="text-sm text-muted-foreground">
                  Watch a replay of user sessions to see exactly what happened before the error.
                </p>
              </div>

              <div className="pt-4 border-t">
                <Button asChild className="w-full" variant="outline">
                  <a href="https://sentry.io" target="_blank" rel="noopener noreferrer">
                    Open Sentry Dashboard →
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
