import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertTriangle, MessageSquare, Send } from "lucide-react";
import { useState } from 'react';
import { toast } from "sonner";

const ProblemReports = () => {
  const [responses, setResponses] = useState<{[key: string]: string}>({});

  const handleSendResponse = (problemId: string) => {
    toast.success(`ส่งคำแนะนำสำหรับปัญหา ${problemId} เรียบร้อยแล้ว!`);
    setResponses(prev => ({ ...prev, [problemId]: '' }));
  };

  const problems = [
    {
      id: 'PR001',
      treeId: 'T045',
      type: 'individual',
      description: 'ใบทุเรียนเริ่มเหลือง อาจเป็นเพราะขาดธาตุอาหาร',
      reportDate: '2024-01-15',
      brokerName: 'นายสมชาย ใจดี',
      status: 'pending'
    },
    {
      id: 'PR002',
      treeId: 'T023',
      type: 'individual',
      description: 'พบแมลงเจาะลำต้น กำลังฉีดยาแก้ไข',
      reportDate: '2024-01-10',
      brokerName: 'นายสมชาย ใจดี',
      status: 'responded',
      response: 'ฉีดยาทุก 3 วัน และตัดกิ่งที่ถูกเจาะออก'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/owner-dashboard">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">รายงานปัญหา</h1>
                <p className="text-muted-foreground">ดูและแก้ไขปัญหาที่แจ้งเข้ามา</p>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-soft">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="space-y-6">
            {problems.map((problem) => (
              <Card key={problem.id} className="shadow-card border-0 bg-card/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      {problem.treeId} - ปัญหา{problem.type === 'individual' ? 'รายต้น' : 'ภาพรวม'}
                    </CardTitle>
                    <Badge className={problem.status === 'pending' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                      {problem.status === 'pending' ? 'รอแก้ไข' : 'แก้ไขแล้ว'}
                    </Badge>
                  </div>
                  <CardDescription>
                    รายงานโดย: {problem.brokerName} | {problem.reportDate}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">รายละเอียดปัญหา:</h4>
                      <p className="text-muted-foreground">{problem.description}</p>
                    </div>

                    {problem.status === 'responded' ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          คำแนะนำที่ส่งไป:
                        </h4>
                        <p className="text-green-700">{problem.response}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">ส่งคำแนะนำ:</h4>
                        <Textarea
                          placeholder="ใส่คำแนะนำการแก้ไขปัญหา..."
                          value={responses[problem.id] || ''}
                          onChange={(e) => setResponses(prev => ({ ...prev, [problem.id]: e.target.value }))}
                          className="min-h-[100px]"
                        />
                        <Button
                          onClick={() => handleSendResponse(problem.id)}
                          className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
                          disabled={!responses[problem.id]?.trim()}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          ส่งคำแนะนำ
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemReports;