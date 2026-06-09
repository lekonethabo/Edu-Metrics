'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AppLink } from '../ui/app-link';
import { loginUserAction } from '@/app/actions/auth';

const formSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
    const { toast } = useToast();
    const [showPassword, setShowPassword] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(values: LoginFormValues) {
        try {
            const response = await loginUserAction(values.email, values.password);

            if (!response.success) {
                throw new Error(response.error);
            }

            setIsSuccess(true);

            toast({
                title: 'Success',
                description: `Welcome back! Redirecting to your portal...`,
            });

            // Force-refresh allows your clean AuthGuard to intercept the fresh user context
            window.location.reload();

        } catch (error: any) {
            let description = 'An unexpected error occurred. Please try again later.';

            if (error.message === 'auth/user-not-found' || error.message === 'auth/invalid-credential') {
                description = 'Invalid credentials. Please check your email and password.';
            } else if (error.message === 'auth/user-disabled') {
                description = 'This user account has been disabled. Please contact support.';
            }

            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: description,
            });
        }
    }

    const isLoading = isSubmitting || isSuccess;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="admin@example.com"
                                    className="bg-transparent"
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center">
                                <FormLabel>Password</FormLabel>
                                <AppLink href="/forgot-password" className="ml-auto inline-block text-sm underline">
                                    Forgot password?
                                </AppLink>
                            </div>
                            <div className="relative">
                                <FormControl>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="bg-transparent"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    disabled={!field.value || isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                                    ) : (
                                        <Eye className="h-4 w-4" aria-hidden="true" />
                                    )}
                                    <span className="sr-only">
                                        {showPassword ? 'Hide password' : 'Show password'}
                                    </span>
                                </Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full font-headline"
                    disabled={isLoading}
                >
                    {isSuccess ? 'Redirecting...' : isSubmitting ? 'Signing In...' : 'Sign In'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </form>
        </Form>
    );
}